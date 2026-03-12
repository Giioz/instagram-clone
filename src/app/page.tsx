import Sidebar from "../components/layout/Sidebar";
import Stories from "../components/stories/Stories";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex justify-center">
        <div className="flex gap-20  mx-auto p-5">
          <div className="w-157.5">
            <Stories />
          </div>

          <div className="w-79.75">{/* Right side content */}</div>
        </div>
      </div>
    </div>
  );
}
