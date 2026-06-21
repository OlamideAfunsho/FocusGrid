import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col-reverse md:flex-row overflow-hidden">
      <div className="w-full md:w-[276px] md:h-full p-2 md:px-4 md:py-6 flex-none border-r-3 border-r-[#F9F9F9]">
        <SideBar />
      </div>

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className=" w-full h-fit px-[30px] py-4 flex-none border-b-3 border-b-[#F9F9F9]">
          <NavBar />
        </div>

        <div className="flex-1 overflow-y-auto px-[30px] py-5 bg-[#F9FAFB]">{children}</div>
      </div>
    </div>
  );
}
