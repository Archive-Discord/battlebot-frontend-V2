import { Members } from "@types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const GuildMemberJoinChart: React.FC<GuildMemberJoinChartProps> = ({
  guildMembersData,
}) => {
  const { t } = useTranslation()
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );

  const labels = () => {
    const labels = [];
    for (let i = 0; i < 7; i++) {
      labels.push(
        dayjs(new Date(new Date().setDate(new Date().getDate() - i))).format(
          "YYYY/MM/DD"
        )
      );
    }
    return labels.reverse();
  };

  const userDatas = () => {
    const users = [0, 0, 0, 0, 0, 0, 0];
    guildMembersData.forEach(member => {
      for (let i = 0; i < 7; i++) {
        const date = dayjs(
          new Date(new Date().setDate(new Date().getDate() - i))
        ).format("YYYY/MM/DD");
        const userTime = dayjs(member.joinedTimestamp).format("YYYY/MM/DD");
        if (userTime == date) return (users[i] = users[i] + 1);
      }
    });
    return users.reverse();
  };

  const data = {
    labels: labels(),
    datasets: [
      {
        label: t("dashboard.analytics.dayOfusers"),
        data: userDatas(),
        fill: true,
        borderColor: "rgba(124,58,237, 0.8)",
        backgroundColor: "rgba(124,58,237, 0.7)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          min: 0
        },
      },
    },
  };

  return (
    <>
      <span className="font-bold mt-3 text-xl">{t("dashboard.analytics.users")}</span>
      <Line className="px-3 mb-4" data={data} options={options} />
    </>
  );
};

interface GuildMemberJoinChartProps {
  guildMembersData: Members[];
}
export default GuildMemberJoinChart;
