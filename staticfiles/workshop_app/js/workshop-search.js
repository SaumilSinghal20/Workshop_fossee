(function () {
  var h = React.createElement;
  var useState  = React.useState;
  var useEffect = React.useEffect;
  var useRef    = React.useRef;

  function StarRating(props) {
    var rating = props.rating;
    var stars = [];
    for (var i = 1; i <= 5; i++) {
      var filled = i <= Math.floor(rating);
      var half   = !filled && (i - 0.5) <= rating;
      stars.push(h('span', {
        key: i,
        className: 'material-icons',
        style: {
          fontSize: '15px',
          color: (filled || half) ? '#f59e0b' : '#d1d5db',
          margin: '0 0.5px',
        },
      }, filled ? 'star' : (half ? 'star_half' : 'star_border')));
    }
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '2px' } },
      stars,
      h('span', { style: { fontSize: '11px', color: '#6b7280', marginLeft: '5px', fontWeight: 600 } },
        rating.toFixed(1) + ' / 5'
      )
    );
  }

  var CAT_IMAGE = {
    'Python':     'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600',
    'Web':        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600',
    'Embedded':   'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=600',
    'CFD':        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600',
    'VLSI':       'https://images.unsplash.com/photo-1454165833767-027ffea9e67a?q=80&w=600',
    'Bio':        'https://images.unsplash.com/photo-1532187863486-abf9bdad1b4c?q=80&w=600',
  };

  function getImg(name) {
    var keys = Object.keys(CAT_IMAGE);
    for (var i = 0; i < keys.length; i++) {
      if (name.toLowerCase().indexOf(keys[i].toLowerCase()) !== -1) {
        return CAT_IMAGE[keys[i]];
      }
    }
    return 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600';
  }

  var CAT_ICON = {
    'Python':   'code',
    'Web':      'language',
    'Embedded': 'memory',
    'CFD':      'air',
    'VLSI':     'bolt',
    'Bio':      'biotech',
  };

  function getIcon(name) {
    var keys = Object.keys(CAT_ICON);
    for (var i = 0; i < keys.length; i++) {
      if (name.toLowerCase().indexOf(keys[i].toLowerCase()) !== -1) {
        return CAT_ICON[keys[i]];
      }
    }
    return 'school';
  }

  function WorkshopTypeCard(props) {
    var r = props.row;
    var tmp = document.createElement('div');
    tmp.innerHTML = r.html;
    var link = tmp.querySelector('a');
    var detailUrl = link ? link.getAttribute('href') : '#';

    var img  = getImg(r.name);
    var icon = getIcon(r.name);

    return h('div', {
      className: 'wtype-card',
      style: {
        display: 'flex', flexDirection: 'column', height: '100%',
        padding: 0, overflow: 'hidden', border: 'none',
        background: 'var(--clr-surface-solid)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      onMouseEnter: function(e) {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      },
      onMouseLeave: function(e) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }
    },
      h('div', {
        style: {
          height: 160, width: '100%', position: 'relative',
          overflow: 'hidden',
        },
      },
        h('img', {
          src: img,
          style: { width: '100%', height: '100%', objectFit: 'cover' },
        }),
        h('div', {
          style: {
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
            borderRadius: 8, padding: '4px 8px',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }
        },
          h('img', {
            src: '/static/workshop_app/img/fossee_logo.png',
            style: { width: 14, height: 14, objectFit: 'contain' }
          }),
          h('span', { style: { fontSize: 9, fontWeight: 800, color: '#1a1d2e', letterSpacing: 0.5 } }, 'FOSSEE')
        ),
        h('div', {
          style: {
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)'
          }
        }),
        h('h3', {
          style: {
            position: 'absolute', bottom: 12, left: 16, right: 16,
            margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 800,
            lineHeight: 1.2, textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }
        }, r.name)
      ),

      h('div', {
        style: {
          padding: '14px 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'var(--clr-surface-solid)',
        },
      },
        h('div', { className: 'wtype-meta', style: { fontSize: '13px', color: 'var(--clr-text-muted)', display: 'flex', alignItems: 'center', gap: 4 } },
          h('span', { className: 'material-icons', style: { fontSize: '15px' } }, 'schedule'),
          r.duration + ' day' + (r.duration === '1' ? '' : 's')
        ),

        h(StarRating, { rating: r.rating }),

        r.description && h('p', {
          style: {
            margin: 0,
            fontSize: '13px',
            color: 'var(--clr-text-muted)',
            lineHeight: 1.6,
            flex: 1,
          },
        }, r.description),

        h('hr', { style: { border: 'none', borderTop: '1px solid var(--clr-border)', margin: '4px 0' } }),

        h('a', {
          href: detailUrl,
          className: 'btn btn-outline-primary',
          style: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontWeight: 600, fontSize: '13px',
          },
        },
          'View Details',
          h('span', { className: 'material-icons', style: { fontSize: '16px' } }, 'arrow_forward')
        )
      )
    );
  }

  function WorkshopSearch(props) {
    var container = document.getElementById(props.containerId);
    if (!container) return null;

    var rows = Array.from(container.querySelectorAll('[data-wtype-row]')).map(function (el) {
      return {
        id: el.dataset.id,
        name: el.dataset.name,
        duration: el.dataset.duration,
        description: el.dataset.description || '',
        rating: parseFloat(el.dataset.rating) || 4.0,
        html: el.outerHTML,
      };
    });

    var initialQuery = (new URLSearchParams(window.location.search)).get('q') || '';
    var stateQuery = useState(initialQuery);
    var query      = stateQuery[0];
    var setQuery   = stateQuery[1];

    var stateFiltered = useState(rows);
    var filtered      = stateFiltered[0];
    var setFiltered   = stateFiltered[1];

    var inputRef = useRef(null);

    useEffect(function () {
      var q = query.trim().toLowerCase();
      if (q) {
        setFiltered(rows.filter(function (r) {
          return r.name.toLowerCase().indexOf(q) !== -1;
        }));
      } else {
        setFiltered(rows);
      }
    }, [query]);

    return h(React.Fragment, null,

      h('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '1rem', background: '#fff',
          border: '1.5px solid var(--clr-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 14px',
          boxShadow: 'var(--shadow-sm)',
        },
      },
        h('span', {
          className: 'material-icons',
          style: { fontSize: '18px', color: 'var(--clr-text-muted)' },
        }, 'search'),

        h('input', {
          ref: inputRef,
          type: 'text',
          placeholder: 'Search workshop types\u2026',
          value: query,
          onChange: function (e) { setQuery(e.target.value); },
          style: {
            flex: 1, border: 'none', outline: 'none',
            fontSize: '0.9375rem', background: 'transparent',
            color: 'var(--clr-text)', padding: 0,
          },
          'aria-label': 'Search workshop types',
        }),

        query && h('button', {
          onClick: function () { setQuery(''); },
          style: {
            background: 'transparent', border: 'none',
            cursor: 'pointer', padding: '0',
            color: 'var(--clr-text-muted)', lineHeight: 1,
          },
          'aria-label': 'Clear search',
        },
          h('span', { className: 'material-icons', style: { fontSize: '16px' } }, 'close')
        )
      ),

      query && h('p', {
        style: { fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginBottom: '0.5rem' },
      },
        filtered.length === 0
          ? 'No workshops match your search.'
          : 'Showing ' + filtered.length + ' of ' + rows.length + ' workshop type' + (rows.length !== 1 ? 's' : '')
      ),

      (filtered.length === 0 && query)
        ? h('div', {
            style: { padding: '2.5rem', textAlign: 'center', color: 'var(--clr-text-muted)' },
          },
            h('span', {
              className: 'material-icons',
              style: { fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem', opacity: 0.35 },
            }, 'search_off'),
            h('p', { style: { margin: 0 } }, 'No results for "' + query + '"')
          )
        : h('div', { className: 'wtype-grid' },
            filtered.map(function (r) {
              return h(WorkshopTypeCard, { key: r.id, row: r });
            })
          )
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    var mount = document.getElementById('react-workshop-search');
    if (!mount) return;
    var root = ReactDOM.createRoot(mount);
    root.render(h(WorkshopSearch, { containerId: 'wtype-rows-source' }));
  });
})();
