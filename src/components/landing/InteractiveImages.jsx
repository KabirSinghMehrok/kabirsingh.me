import React, { useState, useEffect, useRef } from 'react';
import interact from 'interactjs';


const emojiArray = [
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif',
    altEmoji: '😄',
    ariaLabel: 'Happiness on the face of the person',
    displayText: 'Satisfied clients'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.gif',
    altEmoji: '🤩',
    ariaLabel: 'Star-struck face',
    displayText: 'Engaging User Interfaces'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/263a_fe0f/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/263a_fe0f/512.gif',
    altEmoji: '☺',
    ariaLabel: 'Smiling face',
    displayText: 'Accessible Web Design'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f62e_200d_1f4a8/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f62e_200d_1f4a8/512.gif',
    altEmoji: '😮',
    ariaLabel: 'Face with open mouth',
    displayText: 'Seamless User Experiences'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f92f/512.gif',
    altEmoji: '🤯',
    ariaLabel: 'Exploding head',
    displayText: 'Innovative Problem Solving'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif',
    altEmoji: '🔥',
    ariaLabel: 'Fire',
    displayText: 'Performant Code'
  },
  {
    webpLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f340/512.webp',
    gifLink: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f340/512.gif',
    altEmoji: '🍀',
    ariaLabel: 'Clover',
    displayText: 'Elegant Solutions'
  }
];

const InteractiveImagesComponent = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      setIsVisible(window.innerWidth >= 1080);
    };

    checkVisibility(); // Check on initial render
    window.addEventListener('resize', checkVisibility);

    return () => {
      window.removeEventListener('resize', checkVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const container = containerRef.current;
    if (!container) return;

    function randomizePositions() {
      const items = container.querySelectorAll('.resizable-draggable');
      const containerRect = container.getBoundingClientRect();
      if (items.length === 0) return;

      // Set the size of the center element
      const centerItem = items[0];
      const centerSize = 150;
      centerItem.style.width = `${centerSize}px`;
      centerItem.style.height = `${centerSize}px`;

      // Place the first item (center)
      const centerX = (containerRect.width / 2) - (centerSize / 2);
      const centerY = (containerRect.height / 2) - (centerSize / 2);
      centerItem.style.transform = `translate(${centerX}px, ${centerY}px)`;
      centerItem.setAttribute('data-x', String(centerX));
      centerItem.setAttribute('data-y', String(centerY));

      const otherItems = Array.from(items).slice(1);
      const sizes = [100, 100, 100, 100]; // Sizes for the next four items
      const defaultSize = 50; // Size for all subsequent items

      let ringRadius = 150; // Initial radius of the first ring
      let itemsInRing = 4; // Number of items in the first ring
      let currentItemIndex = 0;

      while (currentItemIndex < otherItems.length) {
        const angleStep = (2 * Math.PI) / itemsInRing;
        for (let i = 0; i < itemsInRing && currentItemIndex < otherItems.length; i++) {
          const item = otherItems[currentItemIndex];
          const itemSize = sizes[currentItemIndex] || defaultSize;

          item.style.width = `${itemSize}px`;
          item.style.height = `${itemSize}px`;

          const angle = i * angleStep + (Math.random() - 0.5) * 0.5;
          const radiusOffset = ringRadius + (Math.random() - 0.5) * 50;

          let x = centerX + radiusOffset * Math.cos(angle);
          let y = centerY + radiusOffset * Math.sin(angle);

          // Ensure the item stays within the container's bounds
          x = Math.max(0, Math.min(x, containerRect.width - itemSize));
          y = Math.max(0, Math.min(y, containerRect.height - itemSize));

          item.style.transform = `translate(${x}px, ${y}px)`;
          item.setAttribute('data-x', String(x));
          item.setAttribute('data-y', String(y));

          currentItemIndex++;
        }

        ringRadius += 100;
        itemsInRing += 3;
      }
    }

    function dragMoveListener(event) {
      const target = event.target;
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    randomizePositions();

    const interaction = interact('.resizable-draggable')
      .draggable({
        listeners: { move: dragMoveListener },
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ]
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move: function (event) {
            const target = event.target;
            let x = (parseFloat(target.getAttribute('data-x')) || 0);
            let y = (parseFloat(target.getAttribute('data-y')) || 0);

            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.transform = `translate(${x}px, ${y}px)`;

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }
        },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
          interact.modifiers.aspectRatio({
            ratio: 'preserve'
          }),
          interact.modifiers.restrictSize({
            min: { width: 50, height: 50 },
            max: { width: 200, height: 200 }
          })
        ],
        inertia: true
      });

    return () => {
      interaction.unset();
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      id="interactive-container"
      className="relative w-full h-[400px]"
    >
      {emojiArray.map((emoji, i) => (
        <div className="resizable-draggable" data-id={`image-${i}`} key={i}>
          <picture>
            <source srcSet={emoji.webpLink} type="image/webp" />
            <img
              src={emoji.gifLink}
              alt={emoji.ariaLabel}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </picture>
          <div className="resize-handle top-left" />
          <div className="resize-handle top-right" />
          <div className="resize-handle bottom-left" />
          <div className="resize-handle bottom-right" />
        </div>
      ))}
    </div>
  );
};

export default InteractiveImagesComponent;
