import { useState } from "react";
import { colors, services } from "../data/financialDemo";
import { money, sum } from "../utils/finance";
export function Metric({ label, value, detail }) {
  return (
    <article className="finance-metric">
      <h2>{label}</h2>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}
export function Distribution({ rows, client }) {
  const total = sum(rows);
  const groups = services.map((name, i) => {
    const amount = sum(rows.filter((row) => row.category === name));
    const percent = total ? (amount / total) * 100 : 0;
    const offset = total
      ? (sum(
          rows.filter((row) => services.slice(0, i).includes(row.category)),
        ) /
          total) *
        100
      : 0;
    return {
      name,
      amount,
      percent,
      color: colors[i],
      offset,
    };
  });
  return (
    <section className="finance-panel">
      <h2>
        {client
          ? "Distribuição de gastos por serviço"
          : "Distribuição de serviços"}{" "}
        {!client && <span>(Faturamento)</span>}
      </h2>
      <div className="finance-distribution">
        <div className="finance-donut">
          <svg
            viewBox="0 0 120 120"
            role="img"
            aria-label="Distribuição da receita por serviço"
          >
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="var(--bg-cream)"
              strokeWidth="18"
            />
            {groups.map((group) => (
              <circle
                key={group.name}
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke={group.color}
                strokeWidth="18"
                pathLength="100"
                strokeDasharray={`${group.percent} ${100 - group.percent}`}
                strokeDashoffset={-group.offset}
                transform="rotate(-90 60 60)"
              />
            ))}
          </svg>
          <div>
            <strong>{money(total)}</strong>
            <span>{client ? "Total no período" : "Total do mês"}</span>
          </div>
        </div>
        <ul>
          {groups.map((group) => (
            <li key={group.name}>
              <i style={{ background: group.color }} />

              <span>{group.name}</span>
              <small>{money(group.amount)}</small>
              <b>{Math.round(group.percent)}%</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export function RevenueChart({ rows, client, month }) {
  const [grouping, setGrouping] = useState("Diário");
  const [hovered, setHovered] = useState(null);
  const lastDay = new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5)),
    0,
  ).getDate();
  const buckets = client
    ? [...rows]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((row) => ({
          label: row.date.slice(8) + "/" + row.date.slice(5, 7),
          value: row.amount,
        }))
    : Array.from(
        { length: grouping === "Diário" ? lastDay : Math.ceil(lastDay / 7) },
        (_, i) => ({
          label:
            grouping === "Diário"
              ? String(i + 1).padStart(2, "0")
              : `Sem. ${i + 1}`,
          value: sum(
            rows.filter((row) =>
              grouping === "Diário"
                ? Number(row.date.slice(8)) === i + 1
                : Math.floor((Number(row.date.slice(8)) - 1) / 7) === i,
            ),
          ),
        }),
      );
  const max = Math.max(...buckets.map((bucket) => bucket.value), 1) * 1.2;
  const points = buckets.map((bucket, i) => [
    48 + (i * 540) / Math.max(buckets.length - 1, 1),
    176 - (bucket.value / max) * 140,
  ]);
  const active = hovered === null ? null : buckets[hovered];
  return (
    <section className="finance-panel finance-chart">
      <div className="finance-panel-heading">
        <h2>
          {client
            ? "Histórico de faturamento por visita"
            : "Evolução do faturamento"}{" "}
          <span>({month.split("-").reverse().join("/")})</span>
        </h2>
        {!client && (
          <select
            aria-label="Agrupamento do gráfico"
            value={grouping}
            onChange={(e) => {
              setGrouping(e.target.value);
              setHovered(null);
            }}
          >
            <option>Diário</option>
            <option>Semanal</option>
          </select>
        )}
      </div>
      <svg
        viewBox="0 0 620 218"
        role="img"
        aria-label={
          client ? "Valores gastos em cada visita" : "Receita por dia ou semana"
        }
      >
        <defs>
          <linearGradient id="finance-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--fin-chart)" stopOpacity=".5" />

            <stop
              offset="100%"
              stopColor="var(--fin-chart)"
              stopOpacity=".02"
            />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line
              x1="45"
              x2="605"
              y1={176 - i * 46}
              y2={176 - i * 46}
              stroke="var(--bg-cream)"
            />

            <text x="0" y={180 - i * 46} className="finance-axis">
              {Math.round((max * i) / 3)}
            </text>
          </g>
        ))}
        {!client && buckets.length > 0 && (
          <>
            <path
              d={`M48,176 L${points.map((p) => p.join(",")).join(" L")} L588,176 Z`}
              fill="url(#finance-area)"
            />

            <polyline
              points={points.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke="var(--fin-chart)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </>
        )}
        {buckets.map((bucket, i) => {
          const [x, y] = points[i];
          return (
            <g key={i}>
              {client && (
                <>
                  <rect
                    x={x - 24}
                    y={y}
                    width="48"
                    height={176 - y}
                    rx="5"
                    fill={
                      i === buckets.length - 1
                        ? "var(--burgundy)"
                        : "var(--fin-chart)"
                    }
                  />

                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="finance-bar-value"
                  >
                    {money(bucket.value)}
                  </text>
                </>
              )}
              {(client ||
                i % (grouping === "Diário" ? 5 : 1) === 0 ||
                i === buckets.length - 1) && (
                <text
                  x={x}
                  y="205"
                  textAnchor="middle"
                  className="finance-axis"
                >
                  {bucket.label}
                </text>
              )}
              {!client && (
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="transparent"
                  tabIndex="0"
                  aria-label={`${bucket.label}: ${money(bucket.value)}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                >
                  <title>{`${bucket.label}: ${money(bucket.value)}`}</title>
                </circle>
              )}
            </g>
          );
        })}
      </svg>
      {active && (
        <div className="finance-tooltip">
          {active.label} · {money(active.value)}
        </div>
      )}
      {!rows.length && (
        <p className="finance-empty">Nenhum atendimento neste período.</p>
      )}
    </section>
  );
}
