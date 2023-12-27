const root = 'http://pieceland.hzchainup.com'
// const root = ''

export const API = {
  sendCode: root + '/potato_api/user/verification_code',
  login:  root + '/potato_api/user/login',
  mintInfo: root + '/potato_api/mint/info',
  assetCount: root + '/potato_api/pkg/count',
  supplyPower: root + '/potato_api/pkg/supply_power',
  myRecords: root + '/potato_api/user/fight_records',
  fightRank: root + '/potato_api/fight_board',
  takeOut: root + '/potato_api/user/fight_withdraw',
  useInfo: root + '/potato_api/user/info',
  teamAssetCount: root + '/potato_api/user/asset_count',
  teamInfo: root + '/potato_api/season/unit_info',
  putFight: root + '/potato_api/season/put_fight',
  joinTeam: root + '/potato_api/season/join_unit',
  seasonInfo: root + '/potato_api/season/info',
  seasonStatus: root + '/potato_api/season/status'
}
