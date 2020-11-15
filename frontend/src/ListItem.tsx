import React, { forwardRef, useState } from "react";
import "./App.css";
import styled, { css } from "styled-components";
import { debounce } from "lodash";

interface Props {
  name: string;
  checked: boolean;
  onChange: () => void;
  onNameChange: (name: string) => void;
  onRemove: () => void;
}

export const ListItem = forwardRef<any, Props>(
  ({ name, checked, onChange, onNameChange, onRemove }, ref) => {
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
        <DeleteButton onClick={onRemove}>
          <span role="img" aria-label="Delete">✖️</span>
        </DeleteButton>
      </Container>
    );
  }
);

export default ListItem;

const DeleteButton = styled.button`
  height: 48px;
  width: 48px;
  background-color: transparent;
  border: none;
  position: absolute;
  z-index: 1;
  right: 0.25rem;
  display: none;
  cursor: pointer;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 1rem 0 0.5rem;
  height: 48px;

  &:hover {
    background-color: #fafafa;
  }
  
  &:focus-within ${DeleteButton} {
    display: block;
  }
`;

const Checkbox = styled.input`
  height: 24px;
  width: 24px;
  margin: 12px;
`;

const checkedStyle = css`
  text-decoration: line-through;
  color: #767676;
`;

const Text = styled.input`
  border: none;
  flex: 1;
  background-color: transparent;
  font-size: 1rem;
  ${props => props.checked ? checkedStyle : ''};

  &:focus {
    outline: none;
    border-top: 1px solid transparent;
    border-bottom: 1px solid #767676;
  }
`;
