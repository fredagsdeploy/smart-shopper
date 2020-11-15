import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

export interface NavItemProps {
  to: string;
  title: string;
  alignRight?: boolean;
};

interface Props {
  navItems: NavItemProps[];
};

export const Nav = ({ navItems }: Props) => (
  <NavContainer>
    <List>
      {navItems.map(navItem => (
        <NavItem key={navItem.to} {...navItem} />
      ))}
    </List>
  </NavContainer>
);

const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
`;

const NavItem = ({to, title, alignRight}: NavItemProps) => {
  const history = useHistory();
  return (
    <Item alignRight={alignRight}>
      <Link href={to} aria-label={title} onClick={(event) => {
        event.preventDefault();
        history.push(to);
      }}>
        {title}
      </Link>
    </Item>
  );
};

const Item = styled.li<{alignRight?: boolean}>`
  ${props => props.alignRight ? 'margin-left: auto' : ''};
`;

const Link = styled.a`
  height: 48px;
  min-width: 48px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  font-weight: 700;
  text-decoration: none;
  color: #1776d1;
`;
