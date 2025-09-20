1. 寶石次數



1. pay_credit_total 總共 假如有寶石也會加上來
1. extra 記錄寶石免費旋轉的盤面 
1. extra.gem_game_result.pay_credit_total 寶石贏分
1. gem_info 寶石轉換的位置跟寶石

```
{
  "game_id": 4800,
  "main_game": {
    "pay_credit_total": 3800,
    "game_result": [
      [9, 2, 1],
      [3, 4, 9],
      [4, 5, 9],
      [6, 7, 5],
      [5, 6, 7]
    ],
    "pay_line": [],
    "scatter_info": {
      "id": [9],
      "position": [
        [0, 0],
        [1, 2],
        [2, 2]
      ],
      "amount": 3,
      "multiplier": 0,
      "pay_credit": 0,
      "pay_rate": 0
    },
    "wild_info": null,
    "scatter_extra": null,
    "extra": {
      "gem_game_result": {
        "game_result": {
          "pay_credit_total": 3800,
          "game_result": [
            [7, 8, 2],
            [0, 3, 7],
            [2, 1, 2],
            [4, 7, 2],
            [8, 3, 2]
          ],
          "pay_line": [
            {"pay_line":  1, "symbol_id": 7, "amount": 5, "pay_credit": 150},
            {"pay_line":  2, "symbol_id": 2, "amount": 5, "pay_credit": 400},
            {"pay_line":  3, "symbol_id": 7, "amount": 5, "pay_credit": 150},
            {"pay_line":  4, "symbol_id": 2, "amount": 5, "pay_credit": 400},
            {"pay_line": 11, "symbol_id": 8, "amount": 5, "pay_credit": 150},
            {"pay_line": 12, "symbol_id": 8, "amount": 5, "pay_credit": 150},
            {"pay_line": 13, "symbol_id": 8, "amount": 5, "pay_credit": 150},
            {"pay_line": 14, "symbol_id": 8, "amount": 5, "pay_credit": 150},
            {"pay_line": 19, "symbol_id": 7, "amount": 5, "pay_credit": 150},
            {"pay_line": 20, "symbol_id": 2, "amount": 5, "pay_credit": 400},
            {"pay_line": 21, "symbol_id": 7, "amount": 5, "pay_credit": 150},
            {"pay_line": 22, "symbol_id": 2, "amount": 5, "pay_credit": 400},
            {"pay_line": 23, "symbol_id": 7, "amount": 5, "pay_credit": 150},
            {"pay_line": 24, "symbol_id": 2, "amount": 5, "pay_credit": 400},
            {"pay_line": 27, "symbol_id": 8, "amount": 5, "pay_credit": 150},
            {"pay_line": 28, "symbol_id": 8, "amount": 5, "pay_credit": 150},
            {"pay_line": 29, "symbol_id": 7, "amount": 5, "pay_credit": 150}
          ],
          "scatter_info": null,
          "wild_info": null,
          "scatter_extra": null,
          "extra": null
        },
        "gem_info": [
          { "symbol_id": 10, "pos": [11, 6, 13, 12, 10, 14, 4, 8, 5, 9]    },
          { "symbol_id": 11, "pos": [3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14] }
        ]
      }
    }
  },
  "get_sub_game": true,
  "sub_game": {
    "game_result": [
      {
        "pay_credit_total": 0,
        "game_result": [
          [8, 1, 1],
          [8, 2, 2],
          [3, 1, 8],
          [1, 5, 1],
          [4, 2, 0]
        ],
        "pay_line": [],
        "scatter_info": null,
        "wild_info": null,
        "scatter_extra": null,
        "extra": null
      },
      {
        "pay_credit_total": 80,
        "game_result": [
          [5, 1,  2],
          [3, 5, 10],
          [3, 5,  8],
          [6, 0,  8],
          [7, 1,  1]
        ],
        "pay_line": [
          {"pay_line":  9, "symbol_id": 5, "amount": 4, "pay_credit": 40},
          {"pay_line": 25, "symbol_id": 5, "amount": 4, "pay_credit": 40}
        ],
        "scatter_info": null,
        "wild_info": null,
        "scatter_extra": null,
        "extra": {
          "gem_game_result": {
            "game_result": {
              "pay_credit_total": 595,
              "game_result": [
                [1, 3, 7],
                [8, 3, 5],
                [8, 3, 5],
                [8, 3, 2],
                [3, 2, 0]
              ],
              "pay_line": [
                {
                  "pay_line"  :   0,
                  "symbol_id" :   3,
                  "amount"    :   5,
                  "pay_credit": 100
                },
                {"pay_line": 1, "symbol_id": 1, "amount": 3, "pay_credit": 25},
                {"pay_line": 3, "symbol_id": 1, "amount": 3, "pay_credit": 25},
                {"pay_line": 4, "symbol_id": 7, "amount": 3, "pay_credit": 5},
                {"pay_line": 7, "symbol_id": 3, "amount": 3, "pay_credit": 10},
                {
                  "pay_line"  :  11,
                  "symbol_id" :   3,
                  "amount"    :   5,
                  "pay_credit": 100
                },
                {
                  "pay_line"  :  13,
                  "symbol_id" :   3,
                  "amount"    :   5,
                  "pay_credit": 100
                },
                {
                  "pay_line"  :  14,
                  "symbol_id" :   3,
                  "amount"    :   5,
                  "pay_credit": 100
                },
                {
                  "pay_line"  : 17,
                  "symbol_id" :  3,
                  "amount"    :  3,
                  "pay_credit": 10
                },
                {
                  "pay_line"  : 19,
                  "symbol_id" :  1,
                  "amount"    :  3,
                  "pay_credit": 25
                },
                {
                  "pay_line"  : 21,
                  "symbol_id" :  1,
                  "amount"    :  3,
                  "pay_credit": 25
                },
                {"pay_line": 22, "symbol_id": 7, "amount": 3, "pay_credit": 5},
                {
                  "pay_line"  : 23,
                  "symbol_id" :  1,
                  "amount"    :  3,
                  "pay_credit": 25
                },
                {"pay_line": 24, "symbol_id": 7, "amount": 3, "pay_credit": 5},
                {
                  "pay_line"  : 27,
                  "symbol_id" :  3,
                  "amount"    :  3,
                  "pay_credit": 10
                },
                {"pay_line": 29, "symbol_id": 1, "amount": 3, "pay_credit": 25}
              ],
              "scatter_info": null,
              "wild_info": null,
              "scatter_extra": null,
              "extra": null
            },
            "gem_info": [
              {
                "symbol_id": 10,
                "pos": [4, 6, 3, 8, 13, 12]
              }
            ]
          }
        }
      },
      {
        "pay_credit_total": 0,
        "game_result": [
          [5, 4, 4],
          [7, 6, 2],
          [6, 2, 8],
          [1, 5, 1],
          [7, 6, 2]
        ],
        "pay_line": [],
        "scatter_info": null,
        "wild_info": null,
        "scatter_extra": null,
        "extra": null
      },
      {
        "pay_credit_total": 0,
        "game_result": [
          [5, 1, 2],
          [7, 2, 2],
          [7, 1, 1],
          [6, 8, 4],
          [2, 4, 7]
        ],
        "pay_line": [],
        "scatter_info": null,
        "wild_info": null,
        "scatter_extra": null,
        "extra": null
      },
      {
        "pay_credit_total": 10,
        "game_result": [
          [7, 1, 3],
          [2, 7, 2],
          [7, 8, 8],
          [2, 6, 6],
          [5, 2, 3]
        ],
        "pay_line": [
          {"pay_line": 23, "symbol_id": 7, "amount": 3, "pay_credit": 5},
          {"pay_line": 29, "symbol_id": 7, "amount": 3, "pay_credit": 5}
        ],
        "scatter_info": null,
        "wild_info": null,
        "scatter_extra": null,
        "extra": null
      },
      {
        "pay_credit_total": 10,
        "game_result": [
          [6, 8, 1],
          [6, 6, 0],
          [7, 7, 6],
          [4, 8, 7],
          [7, 1, 1]
        ],
        "pay_line": [
          {"pay_line":  3, "symbol_id": 6, "amount": 3, "pay_credit": 5},
          {"pay_line": 21, "symbol_id": 6, "amount": 3, "pay_credit": 5}
        ],
        "scatter_info": null,
        "wild_info": null,
        "scatter_extra": null,
        "extra": null
      },
      {
        "pay_credit_total": 0,
        "game_result": [
          [8, 8, 4],
          [1, 5, 1],
          [2, 0, 1],
          [7, 7, 8],
          [1, 2, 6]
        ],
        "pay_line": [],
        "scatter_info": null,
        "wild_info": null,
        "scatter_extra": null,
        "extra": null
      },
      {
        "pay_credit_total": 0,
        "game_result": [
          [2,  7, 8],
          [5, 11, 3],
          [7,  6, 4],
          [7,  2, 1],
          [7,  2, 8]
        ],
        "pay_line": [],
        "scatter_info": null,
        "wild_info": null,
        "scatter_extra": null,
        "extra": {
          "gem_game_result": {
            "game_result": {
              "pay_credit_total": 0,
              "game_result": [
                [4, 6, 6],
                [4, 1, 3],
                [7, 2, 4],
                [3, 7, 8],
                [7, 8, 3]
              ],
              "pay_line": [],
              "scatter_info": null,
              "wild_info": null,
              "scatter_extra": null,
              "extra": null
            },
            "gem_info": [
              {"symbol_id": 11, "pos": null}
            ]
          }
        }
      }
    ],
    "pay_credit_total": 1715
  },
  "get_jackpot": false,
  "jackpot": null,
  "get_jackpot_increment": false,
  "jackpot_increment": null,
  "extra": {"RandomWildGem": 0, "WildX2Gem": 0, "Last": 0}
}
```