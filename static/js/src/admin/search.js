import React from 'react';

const Search = (props) => {
    return(
        <div>
            <input className="form-control" type="text" placeholder={props.placeholder} onChange={props.filterPages} />
        </div>
    );
}

export default Search;