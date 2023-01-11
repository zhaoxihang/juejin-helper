import api from "./services/api";
import { parseCookieTokens } from "./utils/index";
import Cookie from "./utils/cookie";
import Sdk from "./sdk";
import Growth from "./growth";
import SeaGold from "./seagold";
import NumPuzz from "./numpuzz";
import Bugfix from "./bugfix";

type JuejinUserProps = {
  user_id: string;
  user_name: string;
  [prop: string]: any;
} | null;

type JuejinCookieTokens = {
  aid: string;
  uuid: string;
  user_unique_id: string;
  web_id: string;
} | null;

class JuejinHelper {
  cookie: Cookie = new Cookie();
  cookieTokens: JuejinCookieTokens = null;
  user: JuejinUserProps = null;
  apiList: string[] = [
    "/v1/user/profile_id",
    "/interact_api/v1/pin_tab_lead",
    "/growth_api/v2/get_today_status",
    "/interact_api/v1/message/count",
    "/content_api/v1/advert/query_adverts",
    "/growth_api/v1/get_counts",
    "/list_api/v1/activity_settings_v1",
    "/user_api/v1/author/recommend",
    "/interact_api/v1/message/count",
    "/recommend_api/v1/article/recommend_all_feed",
    "/growth_api/v1/get_cur_point",
    "/user_api/v1/task/complete",
    "/user_api/v1/user/get_info_pack",
    "/growth_api/v1/user_growth/growth_popup",
    "/tag_api/v1/query_category_briefs",
    "/recommend_api/v1/dislike/white_list",
    "/user_api/v1/task/get",
    "/user_api/v1/user/dynamic",
    "/list_api/v1/annual/user_annual_list",
    "/user_api/v1/follow/isfollowed",
    "/list_api/v1/annual/user_annual"
  ];

  async login(cookie: string) {
    this.cookie.setCookieValue(cookie);
    this.cookieTokens = parseCookieTokens(this.cookie);
    this.user = await api.get("/user_api/v1/user/get", {
      headers: { cookie: this.getCookie() }
    });
    //走各个接口
    for (let apiListElement of this.apiList) {
      await api.get(apiListElement);
    }
  }

  async logout() {
    this.cookie.clear();
    this.user = null;
  }

  getCookie() {
    return this.cookie.toString();
  }

  getCookieTokens() {
    return this.cookieTokens;
  }

  getUser() {
    return this.user;
  }

  async makeToken(): Promise<string> {
    return api.get("/get/token", {
      baseURL: "https://juejin.cn",
      headers: { cookie: this.getCookie() }
    });
  }

  sdk() {
    return new Sdk(this);
  }

  growth() {
    return new Growth(this);
  }

  seagold() {
    return new SeaGold(this);
  }

  numpuzz() {
    return new NumPuzz(this);
  }

  bugfix() {
    return new Bugfix(this);
  }
}

export default JuejinHelper;
