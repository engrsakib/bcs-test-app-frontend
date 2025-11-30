import Login from "@/components/modules/auth/Login";
import LoginPage from "./(auth)/login/page";
import DashboardLayout from "./dashboard/layout";

import PermissonPages from "./dashboard/profile/page";

export default function Home() {
  return (
    <div>


  <Login></Login>
     
      {/* <DashboardLayout> */}
             {/* <DashboardPage>
        // new cmmt
      </DashboardPage> */}
      {/* <PermissonPages></PermissonPages> */}
      {/* </DashboardLayout> */}
      {/* <LoginPage></LoginPage> */}
    </div>
  )
}





// import { redirect } from "next/navigation";

// export default function Home() {
//   redirect("/login");
// }
