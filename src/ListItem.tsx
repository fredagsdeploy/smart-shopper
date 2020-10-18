import React, { forwardRef, useState } from "react";
import "./App.css";
import styled from "styled-components";
import { debounce } from "lodash";

interface Props {
  name: string;
  checked: boolean;
  onChange: () => void;
  onNameChange: (name: string) => void;
}

export const ListItem = forwardRef<any, Props>(
  ({ name, checked, onChange, onNameChange }, ref) => {
    const [_name, setName] = useState(name);

    const debouncedUpdate = debounce(onNameChange, 500);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
      debouncedUpdate(event.target.value);
    };

    return (
      <Container ref={ref}>
        <Checkbox
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-label={_name}
        />
        <Text
          type="text"
          value={_name}
          onChange={handleChange}
          checked={checked}
          aria-label="Item"
        />
      </Container>
    );
  }
);

export default ListItem;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 48px;

  &:hover {
    background-color: #fafafa;
  }
`;

const Checkbox = styled.input`
  height: 24px;
  width: 24px;
  margin: 12px;
`;

const Text = styled.input`
  border: none;
  flex: 1;
  background-color: transparent;
  font-size: 1rem;
  ${(props) => (props.checked ? "text-decoration: line-through" : "")};

  &:focus {
    outline: none;
    border-top: 1px solid transparent;
    border-bottom: 1px solid #767676;
  }
`;
