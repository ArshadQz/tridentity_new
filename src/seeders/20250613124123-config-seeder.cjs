'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('configs', [
      // {
      //   key_name: 'Purchase',
      //   value: 10,
      //   title: null
      // },
      // {
      //   key_name: 'Redemption',
      //   value: 5,
      //   title: null
      // },
      // {
      //   key_name: 'collectible-id',
      //   value: 1001,
      //   title: null
      // },
      // {
      //   key_name: 'collectible-awarded-stamps',
      //   value: 60,
      //   title: null
      // },
      // {
      //   key_name: 'go-prize',
      //   title: "GO:Congratulations!",
      //   value: "You 've won the Tridentity GO Prize. $1,000 in prize vouchers are waiting for you to collect!"
      // },
      // {
      //   key_name: 'go-silver',
      //   title: "GO:Congratulations!",
      //   value:  "You 've won the Tridentity GO SILVER Prize lucky draw . $1,200 in prize vouchers are waiting for you to collect!"
      // },
      // {
      //   key_name: 'go-grand',
      //   title: "GO:Congratulations!",
      //   value: "You 've won the Tridentity GO GRAND Prize lucky draw . $3,00 in prize vouchers are waiting for you to collect!"
      // },
      // {
      //   key_name: 'go-winner-count',
      //    title: null,
      //   value:'60',
      // },
      {
        keyName: 'winner-count',
          // title: null,
        value:'4',
      },
      {
        keyName: 'notification-msg',
        // title: null,
        value:'6',
      },
      // {
      //   key_name: 'catalogue-id',
      //   title: null,
      //   value:'b5334be7-bec1-462c-8dee-76475887d827',
      // },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('config', {
      key_name: [
        'Purchase',
        'Redemption',
        'collectible-id',
        'collectible-awarded-stamps',
        'go-prize',
        'go-silver',
        'go-grand'
      ]
    }, {});
  }
};