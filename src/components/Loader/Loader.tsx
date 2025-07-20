import css from './Loader.module.css';

export default function Loader() {
  return (
    <div className={css.center}>
      <div className={css.orbit}>
        <div className={css.planet}></div>
        <div className={css.planet}></div>
        <div className={css.planet}></div>
      </div>
    </div>
  );
}

