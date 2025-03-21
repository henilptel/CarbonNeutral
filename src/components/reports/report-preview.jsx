import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

const ReportPreview = ({ data }) => {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-center">
        <div className="text-6xl text-muted-foreground mb-4">📄</div>
        <h3 className="text-lg font-medium mb-2">No Report Generated</h3>
        <p className="text-muted-foreground">
          Configure your report parameters and click "Generate Report" to see a preview here.
        </p>
      </div>
    );
  }

  const { 
    reportTitle, 
    reportType, 
    dateRange, 
    generatedAt, 
    reportId,
    data: reportData 
  } = data;

  // Format date
  const formattedDate = new Date(generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format report type for display
  const getReportTypeLabel = () => {
    switch (reportType) {
      case "emissions": return "Emissions Report";
      case "sinks": return "Carbon Sinks Report";
      case "neutrality": return "Neutrality Pathway Report";
      default: return "Report";
    }
  };

  // Format date range for display
  const getDateRangeLabel = () => {
    switch (dateRange) {
      case "last30days": return "Last 30 Days";
      case "last3months": return "Last 3 Months";
      case "last6months": return "Last 6 Months";
      case "lastyear": return "Last Year";
      case "custom": return "Custom Range";
      default: return "All Time";
    }
  };

  // Prepare chart data
  const chartData = reportData.chartData.labels.map((label, index) => {
    const dataPoint = { name: label };
    reportData.chartData.datasets.forEach(dataset => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  // Generate chart colors based on report type
  const getChartColors = () => {
    switch (reportType) {
      case "emissions":
        return ["#ef4444", "#3b82f6", "#f59e0b"];
      case "sinks":
        return ["#22c55e", "#10b981"];
      case "neutrality":
        return ["#ef4444", "#22c55e", "#3b82f6"];
      default:
        return ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b"];
    }
  };

  const chartColors = getChartColors();

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold">{reportTitle || getReportTypeLabel()}</h3>
            <p className="text-muted-foreground">{getDateRangeLabel()}</p>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant="outline" className="mb-1">
              {reportId}
            </Badge>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium">Executive Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(reportData.summary).map(([key, value], index) => {
            const formattedKey = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());
              
            return (
              <div key={key} className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">{formattedKey}</p>
                <p className="text-lg font-bold">
                  {typeof value === "number" 
                    ? value.toLocaleString() + (key.includes("trend") ? "%" : "") 
                    : value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {data.includeCharts && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Data Visualization</h4>
          <div className="h-80 bg-card p-4 rounded-lg border border-border">
            <ResponsiveContainer width="100%" height="100%">
              {reportType === "neutrality" ? (
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [
                      `${value.toLocaleString()} tCO₂e`, 
                      ""
                    ]}
                    contentStyle={{ 
                      backgroundColor: "var(--background)", 
                      borderColor: "var(--border)" 
                    }}
                  />
                  <Legend />
                  {reportData.chartData.datasets.map((dataset, index) => (
                    <Line
                      key={dataset.label}
                      type="monotone"
                      dataKey={dataset.label}
                      stroke={chartColors[index % chartColors.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [
                      `${value.toLocaleString()} tCO₂e`, 
                      ""
                    ]}
                    contentStyle={{ 
                      backgroundColor: "var(--background)", 
                      borderColor: "var(--border)" 
                    }}
                  />
                  <Legend />
                  {reportData.chartData.datasets.map((dataset, index) => (
                    <Bar
                      key={dataset.label}
                      dataKey={dataset.label}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {data.includeRawData && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Raw Data</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Period
                  </th>
                  {reportData.chartData.datasets.map((dataset) => (
                    <th 
                      key={dataset.label}
                      className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {dataset.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {chartData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      {row.name}
                    </td>
                    {reportData.chartData.datasets.map((dataset) => (
                      <td 
                        key={dataset.label}
                        className="px-4 py-2 whitespace-nowrap text-sm text-right"
                      >
                        {row[dataset.label].toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.includeRecommendations && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Recommendations</h4>
          <div className="bg-card p-4 rounded-lg border border-border">
            <ul className="space-y-2">
              {reportData.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs mt-0.5">
                    {index + 1}
                  </div>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="border-t border-border pt-4 text-center text-sm text-muted-foreground">
        <p>Generated by CarbonNeutral Mines Platform</p>
        <p>This report is for informational purposes only.</p>
      </div>
    </div>
  );
};

export default ReportPreview;