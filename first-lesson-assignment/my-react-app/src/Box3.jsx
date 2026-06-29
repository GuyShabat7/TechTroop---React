import Box4 from './Box4'

export default function Box3() {
    return (
        <div style={{
            backgroundColor: '#f4a0a0',
            padding: '16px',
            display: 'inline-flex',
            gap: '8px',
        }}>
            <Box4 />
            <Box4 />
        </div>
    )
}