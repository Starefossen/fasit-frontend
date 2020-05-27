import React from "react";
import { colors } from "../../commonStyles/commonInlineStyles";
import { Link } from "react-router-dom";

const cardStyle = {
  boxShadow: "0 1px 6px 0 rgba(0,0,0,0.2)",
  borderRadius: "2px",
  marginTop: "15px",
};

const cardItemStyle = {
  fontSize: "14px",
  color: colors.darkgrey,
  marginBottom: "0px",
  fontWeight: "bold",
};

export function CardItem(props) {
  const { label, value } = props;
  return (
    <div>
      <div>
        <p style={cardItemStyle}>{label}</p>
        <p>{value ? value : "-"}</p>
      </div>
    </div>
  );
}

export function CardLinkItem(props) {
  const { label, linkTo, secondaryText } = props;

  return (
    <div>
      <div style={{ padding: "2px 16px" }}>
        <Link to={linkTo}>{label}</Link>
        {secondaryText && <p>{secondaryText}</p>}
      </div>
    </div>
  );
}

export function CardList(props) {
  const { label } = props;
  return (
    <div>
      <div>
        <p style={cardItemStyle}>{label}</p>
      </div>
      <div style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
        {props.children}
      </div>
    </div>
  );
}

export function Card(props) {
  const { title, subtitle, content, linkTo } = props;
  return (
    <div style={cardStyle}>
      <div style={{ padding: "2px 16px" }}>
        <h4>
          <b>{linkTo ? <Link to={linkTo}>{title}</Link> : title}</b>
        </h4>
        <h5 style={{ color: colors.grey }}>{subtitle}</h5>
        {content && <p>{content}</p>}
        {props.children}
      </div>
    </div>
  );
}