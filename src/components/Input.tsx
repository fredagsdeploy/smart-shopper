import React from "react";
import styled from "styled-components";

interface Props {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TextField = ({label, value, onChange}: Props) => (
  <Label>
    <Span>{label}</Span>
    <Input type="text" value={value} onChange={onChange} />
  </Label>
);

export const PasswordField = ({label, value, onChange}: Props) => (
  <Label>
    <Span>{label}</Span>
    <Input type="password" value={value} onChange={onChange} />
  </Label>
);

const Label = styled.span`
  display: flex;
  flex-direction: column;
`;

const Span = styled.span`
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  border-radius: 8px;
  border: 1px solid #959595;
  height: 48px;
  padding: 0 1rem;
  margin-bottom: 1.5rem;
  min-width: 300px;
`;