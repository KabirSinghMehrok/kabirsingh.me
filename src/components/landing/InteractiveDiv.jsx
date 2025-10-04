const InteractiveDiv = ({ width, height }) => {
  <div
    // key={i}
    className="resizable-draggable"
    style={{
      width: `${width}px`,
      height: `${height}px`,
    }}
  >
    <picture>
      <source srcSet={'https://fonts.gstatic.com/s/e/notoemoji/latest/263a_fe0f/512.webp'} type="image/webp" />
      <img
        src={'https://fonts.gstatic.com/s/e/notoemoji/latest/263a_fe0f/512.gif'}
        // alt={emoji.ariaLabel}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </picture>
    <div className="resize-handle top-left" />
    <div className="resize-handle top-right" />
    <div className="resize-handle bottom-left" />
    <div className="resize-handle bottom-right" />
  </div>
}

export default InteractiveDiv;