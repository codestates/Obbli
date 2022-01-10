import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";

import {
  Advert,
  Application,
  Org,
  Org_review,
  Person,
  Person_review,
  Position,
  Skill,
} from "./entity";
import dummyData from "./static/dummyData";

function convert(entity) {
  return entity.rows.map((item) => {
    return Object.fromEntries(item.map((v, i) => [entity.columns[i], v]));
  });
}

getConnectionOptions().then(async (config) => {
  Object.assign(config, { dropSchema: true, synchronize: true });
  Object.assign(config, {
    entities: [
      Skill,
      Person,
      Org,
      Advert,
      Position,
      Application,
      Org_review,
      Person_review,
    ],
  });
  const conn = await createConnection(config);

  for (let entity of config.entities) {
    const data = convert(dummyData[entity["name"]]);
    await conn
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(data)
      .execute();
  }

  conn.close();
});
