import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

export const superTokensInit = () => {
  SuperTokens.init({
    appInfo: {
      appName: "Traduka",
      apiDomain: "http://localhost:3001",
      websiteDomain: "http://localhost:5173",
      apiBasePath: "/auth",
      websiteBasePath: "/auth"
    },
    recipeList: [
      EmailPassword.init(),
      Session.init({
        tokenTransferMethod: "cookie",
      })
    ]
  });
};