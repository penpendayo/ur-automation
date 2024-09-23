import { test } from '@playwright/test';

type Building = {
  name: string;
  address: string;
  vacantRooms: {
    name: string | undefined; // 棟名＋部屋番号（正規化されてなくて分離するのが面倒くさいので、これらをまとめてroomNameとして扱う）
    floor: number | undefined; // 階数
    rent: number | undefined; // 家賃
    commonAreaFee: number | undefined; // 共益費
    floorPlan: string | undefined; // 間取り
    floorArea: number | undefined; // 専有面積
  }[];
};

// 本当はアクセシビリティを考慮したコードを書きたかったけど、URのサイトのDOM構造がぐちゃぐちゃだったのでムリだった。
test('test', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 2500, height: 1400 },
  });
  const page = await context.newPage();

  await page.goto('https://www.ur-net.go.jp/chintai/kansai/osaka/list/');

  const areaLocators = await page.locator('article section').all();
  const buildings: Building[] = [];

  // 地域（例：大阪北部、大阪中部など）ごとのアコーディオンを開く
  for (const areaExpandLocator of areaLocators) {
    await areaExpandLocator.getByRole('button').click();

    await page.waitForTimeout(1000);

    const rowLocators = areaExpandLocator.locator('tr');
    const buildingLocators = await rowLocators
      .locator(':scope:has(> td:nth-of-type(4))')
      .all(); // tr要素にtd要素が4つある行＝物件情報がある行

    for (const buildingLocator of buildingLocators) {
      const { buildingName, address } = await buildingLocator
        .locator('td:nth-of-type(1)')
        .textContent()
        .then((content) => {
          if (!content) throw new Error('物件名が取得できませんでした');
          const [buildingName, address] = content.replace('）', '').trim().split('（');
          if (!buildingName) throw new Error('物件名が取得できませんでした');
          if (!address) throw new Error('住所が取得できませんでした');
          return { buildingName, address };
        });

      const bukkenId = await buildingLocator.getAttribute('data-bukken-id');
      if (!bukkenId) throw new Error('data-bukken-idが取得できませんでした');

      const emptyRoomConfirmButton = buildingLocator
        .locator('td', { hasText: '空室確認' })
        .locator('button');

      const isVisible = await emptyRoomConfirmButton.isVisible();
      if (!isVisible) {
        continue;
      }
      await emptyRoomConfirmButton.click();
      await page.waitForTimeout(2000);

      let nextButtonVisible = true;
      while (nextButtonVisible) {
        const buttons = await areaExpandLocator
          .locator('button', { hasText: /^次の\d+部屋を表示する$/ })
          .locator('visible=true')
          .all();

        if (buttons.length === 0) {
          nextButtonVisible = false;
        }

        for (const button of buttons) {
          const isVisible = await button.isVisible();
          if (!isVisible) {
            continue;
          }
          await button.click();
          await page.waitForTimeout(3000);
        }
        await page.waitForTimeout(1000);
      }

      const nextRows = await areaExpandLocator
        .locator(`tr[data-bukken-id="${bukkenId}"]`)
        .and(areaExpandLocator.locator('[data-init="1"]'))
        .locator('ul > li:not(:last-child)')
        .all();

      const vacantRooms: Building['vacantRooms'] = [];
      for (const row of nextRows) {
        const roomName = await row
          .locator('a > span:nth-of-type(2)') // 例: 3号棟1303号室
          .textContent()
          .then((content) => content?.trim());

        const { rent, commonAreaFee } = await row
          .locator('a > span:nth-of-type(3)') // 例: 175,800円（6,000円）
          .textContent()
          .then((content) => {
            if (!content) throw new Error('4列目のテキストが取得できませんでした');
            const regex = /\d{1,3}(,\d{3})*円/g;
            const matchArray = content.trim().match(regex);
            if (!matchArray) throw new Error('家賃と共益費が取得できませんでした');
            const [rent, commonAreaFee] = matchArray;
            return {
              rent: rent.replace('円', '').replace(',', ''),
              commonAreaFee: commonAreaFee?.replace('円', '').replace(',', ''),
            };
          });

        const { floorPlan, floorArea, floor } = await row
          .locator('a > span:nth-of-type(4)')// 例: 1LDK / 73㎡ / 13階
          .textContent()
          .then((content) => {
            if (!content) throw new Error('4列目のテキストが取得できませんでした');

            const [floorPlan, floorArea, floor] = content.trim().split(' / ');
            return {
              floorPlan,
              floorArea: floorArea?.replace('㎡', ''),
              floor: floor?.replace('階', ''),
            };
          });

        vacantRooms.push({
          name: roomName,
          rent: Number(rent),
          commonAreaFee: Number(commonAreaFee),
          floorPlan: floorPlan,
          floorArea: Number(floorArea),
          floor: Number(floor),
        });
      }

      buildings.push({
        name: buildingName,
        address,
        vacantRooms,
      });
    }
  }

  // TODO: buildingをAPIを使って保存するようにする
  console.log(JSON.stringify(buildings, null, 1));
});
