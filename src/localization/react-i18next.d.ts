// import the original type declarations
import 'react-i18next';
// import all namespaces (for the default language, only)
import { resources } from '.';

// react-i18next versions lower than 11.11.0
// declare module "react-i18next" {
//   // and extend them!
//   interface Resources {}
// }

// // react-i18next versions higher than 11.11.0
// declare module "react-i18next" {
//   // and extend them!
//   interface CustomTypeOptions {
//     // custom namespace type if you changed it
//     defaultNS: "ns1";
//     // custom resources type
//     resources: typeof resources["en"];
//   }
// }

/* eslint-disable */
declare module 'react-i18next' {
  interface CustomTypeOptions {
    //   defaultNS: typeof defaultNS;
    resources: typeof resources['en'];
  }
}
