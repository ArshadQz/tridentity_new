export const seqVError = (err) => {
  switch (err.name) {
    case `SequelizeUniqueConstraintError`:
      const items = err.errors;
      const errorMsg = items
        .map((e) => {
          return e.message;
        })
        .join(",");
      return errorMsg;
    default:
      return err.message;
  }
};
