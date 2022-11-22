import { HeaderAction } from "../components/navbar/navbar";
import { FooterLinks } from "../components/footer/footer";
import linksData from "../public/jsons/data.json";
import data from "../public/jsons/footer.json";

type layOutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: layOutProps) {
  return (
    <>
      <HeaderAction links={linksData.links} />
      <main>{children}</main>
      <FooterLinks data={data.data} />
    </>
  );
}
