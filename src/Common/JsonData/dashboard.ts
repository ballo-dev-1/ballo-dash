import imgStatus4 from "@assets/images/widget/img-status-4.svg";
import imgStatus5 from "@assets/images/widget/img-status-5.svg";
import imgStatus6 from "@assets/images/widget/img-status-6.svg";

import facebook from "@assets/images/widget/img-facebook.svg";
import status7 from "@assets/images/widget/img-status-7.svg";
import google from "@assets/images/widget/img-google.svg";
import status8 from "@assets/images/widget/img-status-8.svg";
import twitter from "@assets/images/widget/img-twitter.svg";
import status9 from "@assets/images/widget/img-status-9.svg";
import instagram from "@assets/images/widget/img-instagram.svg";
import linkedin from "@assets/images/widget/img-linkedin.svg";

interface WidgetItem {
  id: number;
  cardImg: string;
  title: string;
  latestValue: string;
  previousValue: string;
  percentage?: number;
  bagdeColor?: string;
  description: string;
}

const widgetData: WidgetItem[] = [
  {
    id: 1,
    cardImg: imgStatus4,
    title: "Total Reach",
    latestValue: "550",
    previousValue: "468",
    description:
      "Your total reach has grown by 82 across all platforms this Week",
    percentage: 15,
    bagdeColor: "success",
  },
  {
    id: 2,
    cardImg: imgStatus5,
    title: "Total Engagement",
    latestValue: "137",
    previousValue: "106",
    description: "You had 31 more engagements on your last post",
    percentage: 23,
    bagdeColor: "primary",
  },
  {
    id: 3,
    cardImg: imgStatus6,
    title: " Total Ad Spend",
    latestValue: "K2,567.09",
    previousValue: "K2,263",
    percentage: 10.23,
    description: "You spent K263 less since your previous ad",
    bagdeColor: "danger",
  },
];

interface socialWidgetsItem {
  id: number;
  img: string;
  percentage: string;
  bgImg: string;
}

const socialWidgetsData: socialWidgetsItem[] = [
  {
    id: 1,
    img: facebook,
    percentage: "7.2",
    bgImg: status7,
  },
  {
    id: 2,
    img: instagram,
    percentage: "5.9",
    bgImg: status8,
  },
  {
    id: 3,
    img: linkedin,
    percentage: "6.2",
    bgImg: status9,
  },
];

export { widgetData, socialWidgetsData };
