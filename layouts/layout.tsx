import { HeaderAction } from "../components/navbar/navbar";
import { FooterLinks } from "../components/footer/footer";
import linksData from "../public/jsons/data.json";
import data from "../public/jsons/footer.json";
import Script from "next/script";

type layOutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: layOutProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=UA-53362005-1"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
  
            gtag('config', 'UA-53362005-1');
            `}
      </Script>
      <HeaderAction links={linksData.links} />
      <main>{children}</main>
      <FooterLinks data={data.data} />
    </>
  );
}
