import { Card, CardProps } from "./Card";
import { FaBan } from "react-icons/fa";

interface Props extends CardProps {
  showForm?: boolean;
}

export const KPCard = ({ ...props }: Props) => {
  const showExtra = props.colSpan && props.colSpan > 1;

  return (
    <Card {...props} titleIcon={false ? <FaBan /> : undefined}>
      <div className="grid grid-cols-12">
        {showExtra && (
          <div className="col-span-8 mt-4">
            <div className="badge badge-secondary mr-0.5 h-6">Derek</div>
            <div className="badge badge-accent mr-0.5 h-6">Raymond</div>
            <div className="badge badge-accent  mr-0.5 h-6">Eevee</div>
            <div className="badge mr-0.5 h-6">Eevee</div>
            <div className="badge mr-0.5 h-6">Eevee</div>
            <div className="badge mr-0.5 h-6">Eevee</div>
            <div className="badge mr-0.5 h-6">Eevee</div>
            <div className="badge mr-0.5 h-6">Eevee</div>
            <div className="badge h-6">Eevee</div>
          </div>
        )}
        <div
          className={`stat place-items-center ${
            showExtra ? "col-span-4" : "col-span-12"
          }`}
        >
          <div className="stat-value text-secondary">12</div>
          <div className="stat-desc text-secondary">Eters ↗︎ 40 (2%)</div>
        </div>
      </div>
    </Card>
  );
};
