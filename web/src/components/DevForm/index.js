import React, { useState, useEffect } from 'react'
import './styles.css'

function DevForm({ onSubmit }) {
	const [github_username, setGithubUsername] = useState('')
	const [techs, setTechs] = useState('')
	const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords
				setLatitude(latitude)
				setLongitude(longitude)
			},
			(err) => {
				console.log(err)
			},
			{
				timeout: 30000,
			}
		)
    }, [])
    
    async function handleSubmit(e) {
        e.preventDefault()
        await onSubmit({
            github_username,
            techs,
            latitude,
            longitude
        })
        setGithubUsername('')
		setTechs('')
    }

    return (
        <form className="dev-form" onSubmit={handleSubmit}>
            <h1>Cadastro de Devs</h1>
            <label>
                Usuário do Github
                <input
                    size="1"
                    name="github_username"
                    required
                    value={github_username}
                    onChange={e => setGithubUsername(e.target.value)}
                />
            </label>

            <label>
                Tecnologias
                <input
                    size="1"
                    name="techs"
                    required
                    value={techs}
                    onChange={e => setTechs(e.target.value)}
                />
            </label>

            <label>
                Latitude
                <input
                    name="latitude"
                    type="number"
                    required
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                />
            </label>

            <label>
                Longitude
                <input
                    name="longitude"
                    type="number"
                    required
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                />
            </label>

            <button type="submit">Cadastrar</button>
            </form>
    )
}
export default DevForm