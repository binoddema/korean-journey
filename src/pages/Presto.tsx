import React from "react";
import { Card } from "../components/ui";
import { PageHeader } from "../components/Layout";

export const Presto = ({
  icon,
  titolo,
  testo,
}: {
  icon: string;
  titolo: string;
  testo: string;
}) => (
  <>
    <PageHeader icon={icon} title={titolo} />
    <Card className="pad">
      <p className="muted" style={{ margin: 0 }}>
        {testo}
      </p>
    </Card>
  </>
);
