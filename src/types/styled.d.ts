import "styled-components";
// import original module declarations

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      blueColor: string;
      greenColor: string;
      greyColor: string;
      yellowColor: string;
    };
  }
}
