import React, { Component } from "react";

class IterationSample extends Component {
    state = {
        names: ['models/gltf/Flower/Flower.glb',
            'models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
            'models/gltf/LeePerrySmith/LeePerrySmith.glb',
            'models/gltf/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf'],
        name: ''
    };

    handleChange = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    handleInsert = () => {
        this.setState({
            names: this.state.names.concat(this.state.name),
            name:''
            }            
        );
    }

    handleRemove = (index) => {
        const { names } = this.state;

        this.setState({
            names: names.filter((name, i) => i !== index )
        });
    }

    handleSelect = (name) => {
        this.setState({
            name:name
        });
    }

    render() {
        const nameList = this.state.names.map(
            (name, index) => (<li key={index} onDoubleClick={() => this.handleRemove(index)}
                onClick={() => this.handleSelect(name)}>{name}</li>)
        );

        const { onChangeFile } = this.props;

        return (
            <div>
                <input 
                    onChange={this.handleChange}
                    value={this.state.name} />
                <button onClick={this.handleInsert}>추가</button>
                <button onClick={()=>onChangeFile(this.state.name)}>선택</button>
                <ul>
                    {nameList}
                </ul>
            </div>
        );
    }
}

export default IterationSample;