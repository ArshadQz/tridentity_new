import axios from "axios";

export const postJson = async (url, data, headerAddons = {}) => {
  return await axios({
    method: `post`,
    url,
    headers: {
      "Content-Type": `application/json`,
      ...headerAddons,
    },
    data,
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(`error?`, error);
      throw error;
    });
};
export const postForm = async (url, form, headerAddons = {}) => {
  return await axios({
    method: `post`,
    url,
    headers: {
      // 'Content-Type': `application/json`,
      ...form.getHeaders(),
      ...headerAddons,
    },
    data: form,
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(`error?`, error);
      throw error;
    });
};

export const getJson = async (url, headerAddons = {}, params) => {
  return await axios({
    method: `get`,
    url,
    headers: {
      "Content-Type": `application/json`,
      ...headerAddons,
    },
    params,
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};
