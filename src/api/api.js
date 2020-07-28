import http from "../unit/http";
// import cookie from "js-cookie";

// let id = cookie.get("CURRENT-USER-ID");
// let phone = cookie.get("CURRENT-USER-PHONE");
// let tags = cookie.get("CURRENT-USER-TAGS");

let headerV4 = {
  Authorization:
    "b01110629541b3eb51697db5a05dd2388aed11a58c81a75e9c08347bc30a09e6:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lc3BhY2VfaWQiOjF9.wj9V0ZVOOzSPuRYztizJL_5w0u8aJKb05Z73tEV_HuY"
};
let headerSQL = {
  Authorization:
    "gid://slp-table-mapper/Namespace/1&eyJhbGciOiJIUzI1NiJ9.eyJnaWQiOiJnaWQ6Ly9za3lsYXJrL05hbWVzcGFjZS8xIn0.98s5bGjHrRCDcZKF787kuEdq_k8be3-7awVPFGwK6NI"
};
// admin
export default {
  // 登录oauth
  getMagnateOauthAPI() {
    return http.get("/magnate/oauth");
  },
  getUserAPI(token) {
    return http.get(`/v1/user?access_token=` + token);
  },
  // 翻版
  // 渲染表单
  getFormAPI(formID) {
    return http.get(`/v4/forms/${formID}`, "", headerV4);
  },
  // 渲染表项
  getFormResponsesAPI(formID) {
    return http.get(`/v4/forms/${formID}/responses`, "", headerV4);
  },
  // 发送数据
  postFormAPI(formID, data) {
    return http.post(`/v4/forms/${formID}/responses`, data, headerV4);
  },
  getTableJsonAPI(sql) {
    return http.get(
      `/api/table_mapper/json_api/execute_select_sql?sql=` + sql,
      "",
      headerSQL
    );
  }
};
