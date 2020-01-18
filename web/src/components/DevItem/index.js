import React from 'react'
import './styles.css'

function DevItem({ dev }) {
    return (
        <li className="dev-item">
            <header>
                <img
                    src={dev.avatar_url}
                    alt={dev.name}
                />
                <h2>{dev.name}</h2>
                <p>{dev.techs.join(', ')}</p>
            </header>
            <p>{dev.bio}</p>
            <a href={`https://github.com/${dev.github_username}`} target="_blank">
                Acessar perfil no Github
            </a>
        </li>
    )
}
export default DevItem