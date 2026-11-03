/* The V1.0 key, word indices and progress shape are intentionally unchanged. */
(function (global) {
  'use strict';
  const KEY = 'yoyo_sky_v1';
  const empty = () => ({seen: [], sessions: [], misses: {}});
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const wordId = value => Number.isInteger(value) && value >= 0 && value < 20;
  function validate(value) {
    if (!object(value)) return empty();
    const seen = Array.isArray(value.seen) ? [...new Set(value.seen.filter(wordId))] : [];
    const sessions = Array.isArray(value.sessions) ? value.sessions.filter(s => object(s) &&
      Number.isFinite(s.time) && s.time >= 0 && Number.isInteger(s.score) && s.score >= 0 && s.score <= 12) : [];
    const misses = object(value.misses) ? Object.fromEntries(Object.entries(value.misses).filter(([id, count]) =>
      /^(0|[1-9]\d*)$/.test(id) && wordId(Number(id)) && Number.isInteger(count) && count >= 0)) : {};
    return {...value, seen, sessions, misses};
  }
  function create(getStorage, onStatus = () => {}) {
    let storage, raw, pendingBackup = false, data = empty();
    const backupKey = KEY + '_backup_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    try {
      storage = typeof getStorage === 'function' ? getStorage() : getStorage;
      raw = storage.getItem(KEY);
      if (raw !== null) {
        let parsed;
        try { parsed = JSON.parse(raw); } catch { parsed = undefined; }
        data = validate(parsed);
        pendingBackup = JSON.stringify(data) !== JSON.stringify(parsed);
        if (pendingBackup) onStatus('Some saved progress needs recovery. The original will be backed up before saving.');
      }
    } catch {
      onStatus('Saved progress is unavailable. Progress may not be saved on this device.');
    }
    return {
      data,
      save(value) {
        try {
          if (!storage) throw new Error('Storage unavailable');
          if (pendingBackup) {
            storage.setItem(backupKey, raw);
            if (storage.getItem(backupKey) !== raw) throw new Error('Backup failed');
            pendingBackup = false;
          }
          storage.setItem(KEY, JSON.stringify(value));
          onStatus('');
          return true;
        } catch {
          onStatus('Progress could not be saved. Keep this page open and try again.');
          return false;
        }
      }
    };
  }
  global.YoyoStorage = {create, validate, KEY};
})(globalThis);
