import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

export const resources = {
  en: {
    translation: {
      login_button: "Login",
      signup_button: "Sign Up",
    },
  },
  fr: {
    translation: {
      login_button: "Connexion",
      signup_button: `S'inscrire`,
    },
  },
};

export default async function initializeLocalization() {
  try {
    const locale = Localization.locale;
    i18n
      .use(initReactI18next) // passes i18n down to react-i18next
      .init({
        resources: resources,
        compatibilityJSON: "v3",
        lng: locale, // 'en' language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
          escapeValue: false, // react already safes from xss
        },
        react: {
          useSuspense: false,
        },
      });
  } catch (error) {
    console.log("INITIALIZE LOCALIZATION ERROR", error);
  }
}
