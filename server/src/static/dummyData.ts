export default {
  Skill: {
    columns: ['uuid', 'name'],
    rows: [
      ['f34a055c-34d3-4148-a2e3-c5e7ed715036', '지휘'],
      ['0f42cfd2-fb3b-4f32-b9d5-765ae77ae290', '바이올린'],
      ['8e9c0f01-9d19-4a9b-9f8f-cd64ea51f58e', '플룻'],
    ],
  },
  Person: {
    columns: ['uuid', 'user_id', 'pw_hash', 'realname', 'professional', 'skill_uuid', 'history', 'email', 'cellular'],
    rows: [
      ['654d1f39-a3f4-4f23-8312-ceafdaaa007d', 'choi', '1234', '최희준', true, 'f34a055c-34d3-4148-a2e3-c5e7ed715036', null, 'choi@director.com', null],
      ['8d74acce-3b44-42ad-a739-237cc7c1b098', 'yoon', '5678', '윤소영', true, '0f42cfd2-fb3b-4f32-b9d5-765ae77ae290', null, 'yoon@violin.com', null],
      ['c68dad62-f25f-4e62-8320-43c7bed458fe', 'wandu', '1011', '완두', false, '8e9c0f01-9d19-4a9b-9f8f-cd64ea51f58e', null, 'wandu@cat.com', null],
    ],
  },
  Org: {
    columns: ['uuid', 'user_id', 'pw_hash', 'name', 'description', 'since', 'headcount', 'created_at'],
    rows: [
      [
      '9c200b48-11bf-4500-adf3-f4f20ac592ad',
      'AAA',
      'abcd',
      '샬케04',
      '파란색 유니폼으로 로얄 블루스라는 애칭을 얻고 있으며, 90년대부터 2010년대 초반까지 독일에서 강호 축에 속했던 클럽이다',
      new Date('1980-05-15T00:00:00.000Z'),
      34,
      new Date('2021-12-01T16:11:01.324Z'),
      ],
      [
        '76df7573-8f30-440c-8ded-c8598ba880a1',
        'BBB',
        'efghi',
        '레스터시티',
        '영국 잉글랜드 프리미어 리그의 프로 축구 클럽. 연고지는 레스터. 홈 구장은 킹 파워 스타디움.',
        new Date('2001-01-23T00:00:00.000Z'),
        75,
        new Date('2021-12-09T09:04:01.099Z'),
      ],
      [
        '8e9712c5-4cdb-4aa6-9e97-9130bf8fa30c',
        'CCC',
        'jflm',
        '발렌시아FC',
        '스페인 프리메라 리가 소속의 팀으로 최근 수년간의 암흑기를 지나 다시 한 번 반등을 꿈꾸는 스페인 전통의 명문 클럽이다.',
        new Date('2011-04-19T00:00:00.000Z'),
        22,
        new Date('2021-12-22T19:19:00.965Z'),
      ],
    ],
  },
  Advert: {
    columns: ['uuid', 'org_uuid', 'title', 'body', 'active_until', 'event_at', 'location', 'created_at'],
    rows: [
      ['44fa4a0e-be4a-4d9b-86ad-5764b7fe547f', '9c200b48-11bf-4500-adf3-f4f20ac592ad', '같이 할사람?', '한 명만 오면 고', new Date('2021-12-09T18:00:00.000Z'), new Date('2021-12-10T09:30:00.000Z'), '서울특별시 중구 세종대로 110', new Date('2021-12-01T17:35:01.192Z')],
      ['e6cf98e6-15cc-4e2d-8588-2eb9cf4a102c', '76df7573-8f30-440c-8ded-c8598ba880a1', '모집합니다.', '일단 오세요', new Date('2021-12-23T15:00:00.000Z'), new Date('2021-12-30T13:30:00.000Z'), '서울특별시 송파구 올림픽로 25', new Date('2021-12-14T15:11:04.847Z')],
    ],
  },
  Position: {
    columns: ['uuid', 'advert_uuid', 'skill_uuid', 'quota'],
    rows: [
      ['d19061fe-6c80-41bc-9940-6e8eb2ac96e5', '44fa4a0e-be4a-4d9b-86ad-5764b7fe547f', '8e9c0f01-9d19-4a9b-9f8f-cd64ea51f58e', 1],
      ['f5be84c1-9d77-48a3-8d94-a65da2ffe289', '44fa4a0e-be4a-4d9b-86ad-5764b7fe547f', '0f42cfd2-fb3b-4f32-b9d5-765ae77ae290', 1],
      ['d6dd737e-bccb-4d90-8fbb-e33bf32e2554', 'e6cf98e6-15cc-4e2d-8588-2eb9cf4a102c', 'f34a055c-34d3-4148-a2e3-c5e7ed715036', 1],
      ['4d34cbe4-f93b-4e18-a016-5e70847bb63a', 'e6cf98e6-15cc-4e2d-8588-2eb9cf4a102c', '8e9c0f01-9d19-4a9b-9f8f-cd64ea51f58e', 2],
    ],
  },
  Application: {
    columns: ['person_uuid', 'position_uuid', 'created_at', 'received_at', 'hired_at'],
    rows: [
      ['c68dad62-f25f-4e62-8320-43c7bed458fe', 'd19061fe-6c80-41bc-9940-6e8eb2ac96e5', new Date('2021-12-01T17:38:01.192Z'), new Date('2021-12-01T17:38:32.091Z'), new Date('2021-12-01T17:38:41.193Z')],
      ['654d1f39-a3f4-4f23-8312-ceafdaaa007d','4d34cbe4-f93b-4e18-a016-5e70847bb63a', new Date('2021-12-01T17:38:01.192Z'), new Date('2021-12-01T17:38:32.091Z'),null],
      ['c68dad62-f25f-4e62-8320-43c7bed458fe','f5be84c1-9d77-48a3-8d94-a65da2ffe289', new Date('2021-12-03T12:11:23.576Z'),new Date('2021-12-01T17:38:32.091Z'),null],
      ['8d74acce-3b44-42ad-a739-237cc7c1b098','f5be84c1-9d77-48a3-8d94-a65da2ffe289', new Date('2021-12-03T12:11:23.576Z'),new Date('2021-12-01T17:38:32.091Z'),null]
    ],
  },
  Person_review: {
    columns: ['person_uuid', 'org_uuid', 'rating', 'comment', 'created_at'],
    rows: [
      ['c68dad62-f25f-4e62-8320-43c7bed458fe', '9c200b48-11bf-4500-adf3-f4f20ac592ad', 5, '귀여워요', new Date('2021-12-03T12:11:23.576Z')],
      ['c68dad62-f25f-4e62-8320-43c7bed458fe', '76df7573-8f30-440c-8ded-c8598ba880a1', 1, '아쉬워요', new Date('2021-12-03T12:11:23.576Z')],
      ['8d74acce-3b44-42ad-a739-237cc7c1b098', '9c200b48-11bf-4500-adf3-f4f20ac592ad', 4, '이게뭐요', new Date('2021-12-03T12:11:23.576Z')],
    ],
  },
  Org_review:
  {
    columns: ['person_uuid', 'org_uuid', 'rating', 'comment', 'created_at'],
    rows: [
      ['c68dad62-f25f-4e62-8320-43c7bed458fe', '9c200b48-11bf-4500-adf3-f4f20ac592ad', 2, '양옹', new Date('2021-12-10T17:51:51.948Z') ],
      ['8d74acce-3b44-42ad-a739-237cc7c1b098', '9c200b48-11bf-4500-adf3-f4f20ac592ad', 5, '꽥꽥', new Date('2021-12-10T17:51:51.948Z') ],
    ],
  },
}
