import Sequelize from "sequelize";
const Op = Sequelize.Op;
export const Q_listoptions = (req) => {
  const { limit, offset, order } = req.query;

  const options = {};
  if (limit) options.limit = Number(limit);
  if (offset) options.offset = Number(offset);
  if (order) {
    const orderObj = JSON.parse(order);
    options.order = orderObj.order;
  }
  return options;
};

export const Q_where = (conditions, req) => {
  const query = req.query;
  const where = {};
  if (conditions) {
    // console.log(`query?`, query);
    for (const c of conditions) {
      const { field, type = `=` } = c;
      if (query[`${field}`]) {
        // type : = |
        let value = query[`${field}`];
        if ("null" === value) value = null;

        switch (type) {
          case `=`:
            where[`${field}`] = value;
            break;
          case `!Null`:
            if (value) {
              if (value === "true") {
                value = {
                  [Op.not]: null,
                };
              } else {
                value = null;
              }
            }
            where[`${field}`] = value;
            break;
        }
      }
    }
  }
  return where;
};
