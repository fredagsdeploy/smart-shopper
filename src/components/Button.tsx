import styled from "styled-components";

export const Button = styled.button`
  height: 48px;
  padding: 0 1rem;
  background-color: #2196f3;
  color: white;
  font-weight: 700;
  font-size: 1em;
  border: none;
  border-bottom: 4px solid #1976d2;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #1e88e5;
    border-color: #1565c0;
  }

  @media screen and (max-width: 375px) {
    width: 100%;
  }
`;