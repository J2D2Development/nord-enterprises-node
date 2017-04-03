import React from 'react';

const Search = (props) => {
    return(
        <div>
            <input className="form-control" type="text" placeholder={props.placeholder} onChange={props.filterPages} />
        </div>
    );
}

Search.PropTypes = {
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
};

export default Search;