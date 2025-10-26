import DashboardLayout from "./dashboard/layout";

import PermissonPages from "./dashboard/permission/page";

export default function Home() {
  return (
    <div>
      {/* some feather add */}
     
      <DashboardLayout>
             {/* <DashboardPage>
        // new cmmt
      </DashboardPage> */}
      <PermissonPages></PermissonPages>
      </DashboardLayout>
    </div>
  )
}
