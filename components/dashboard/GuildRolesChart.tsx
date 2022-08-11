import { Roles } from "@types";
import { numberToColour } from "@utils/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

const GuildRolesChart: React.FC<GuildRolesChartProps> = ({guildRolesData}) => {
  const { t } = useTranslation()
  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const guildRoles = guildRolesData
    ?.filter(role => role.name !== "@everyone")
    .sort((a, b) => {
      if (a.members > b.members) return -1;
      else if (a.members < b.members) return 1;
      return 0;
    });
  const guildRolesdata = {
    labels: guildRoles?.map(role => role.name),
    datasets: [
      {
        data: guildRoles?.map(role => role.members),
        backgroundColor: guildRoles?.map(role => numberToColour(role.color)),
        borderColor: ["rgb(0,0,0, 0.3)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <span className="font-bold mt-3 text-xl">{t("dashboard.analytics.roles")}</span>
      <Pie className="mb-4" data={guildRolesdata} />
    </>
  );
};

interface GuildRolesChartProps {
    guildRolesData : Roles[]
}

export default GuildRolesChart;
