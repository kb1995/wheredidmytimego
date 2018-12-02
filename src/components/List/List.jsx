import React from 'react';
import ListItem from '../ListItem/ListItem'

const List = (props) => {
    // const Recipes = props.map((item, idx) => {
    //     return (<ListItem/>)
    // });
    return (
        <ul>
            {/* {Recipes} */}
            <ListItem/>
        </ul>
    )
}

export default List;
