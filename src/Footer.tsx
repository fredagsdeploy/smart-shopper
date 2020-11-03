import {Button} from "./components/Button";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faList, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {addShoppingList} from "./reducers/shoppingLists";
import { v4 as uuid } from "uuid";

export function Footer() {
    const dispatch = useDispatch();

    return <FooterContainer>
        <Button onClick={() => {
            console.log("New list")
            dispatch(addShoppingList({shoppingListId: uuid()}))
        }}>
            <AddListIcon/>
        </Button>
    </FooterContainer>;
}

const AddListIcon = () => {
    return (
        <div style={{position: "relative"}}>
            <FontAwesomeIcon icon={faList}/>
            <FontAwesomeIcon
                icon={faPlusCircle}
                size="xs"
                style={{
                    position: "absolute",
                    right: -4,
                    bottom: -2,
                    color: "black",
                    backgroundColor: "white",
                    border: "1px solid white",
                    borderRadius: 10,
                }}
            />
        </div>
    );
};
const FooterContainer = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: white;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2);
    

`;