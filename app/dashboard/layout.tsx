import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-screen flex-col-reverse md:flex-row overflow-hidden unique-layout-root">
  {/* Bottom Bar on Mobile / Side Bar on Desktop */}
  <div className="w-full md:w-[276px] h-fit md:h-full p-2 md:px-4 md:py-6 flex-shrink-0 md:flex-none border-t border-t-neutral-100 md:border-t-0 md:border-r-3 md:border-r-[#F9F9F9] bg-white z-10">
    <SideBar />
  </div>

  {/* Main Workspace Column */}
  <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
    {/* Top Nav Bar */}
    <div className="w-full h-fit px-[30px] py-4 flex-shrink-0 md:flex-none border-b-3 border-b-[#F9F9F9] bg-white z-10">
      <NavBar />
    </div>

    {/* Scrollable Page View */}
    <main className="flex-1 overflow-y-auto px-[30px] py-5 bg-[#F9FAFB]">
      {children}
    </main>
  </div>
</div>
  );
}
