import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

const FESTIVAL_CAMPAIGNS = [
  {
    id: 'ugadi',
    name: 'Ugadi',
    startDate: '2027-03-20',
    endDate: '2027-04-10',
    isEvergreen: false,
    ctaLink: '#shop-by-craving',
  },
  {
    id: 'deepavali',
    name: 'Deepavali',
    startDate: '2026-10-25',
    endDate: '2026-11-15',
    isEvergreen: false,
    ctaLink: '#signature-picks',
  },
  {
    id: 'everyday',
    name: 'Every Celebration',
    isEvergreen: true,
    ctaLink: '#signature-picks',
  },
];

function determineActiveCampaign(currentDate = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const kolkataDateStr = formatter.format(currentDate);

  for (const campaign of FESTIVAL_CAMPAIGNS) {
    if (!campaign.isEvergreen && campaign.startDate && campaign.endDate) {
      if (kolkataDateStr >= campaign.startDate && kolkataDateStr <= campaign.endDate) {
        return campaign.id;
      }
    }
  }

  return 'everyday';
}

describe('Festival Campaigns & Active-Date Logic', () => {
  test('Detects Deepavali as active campaign during its date window (Nov 2, 2026)', () => {
    const testDate = new Date('2026-11-02T12:00:00+05:30');
    const active = determineActiveCampaign(testDate);
    assert.equal(active, 'deepavali');
  });

  test('Detects Ugadi as active campaign during its spring date window (March 25, 2027)', () => {
    const testDate = new Date('2027-03-25T12:00:00+05:30');
    const active = determineActiveCampaign(testDate);
    assert.equal(active, 'ugadi');
  });

  test('Gracefully falls back to Evergreen Every Celebration when outside festival windows', () => {
    const testDate = new Date('2026-07-15T12:00:00+05:30');
    const active = determineActiveCampaign(testDate);
    assert.equal(active, 'everyday');
  });

  test('All campaigns have valid internal CTA anchor links', () => {
    for (const c of FESTIVAL_CAMPAIGNS) {
      assert.ok(c.ctaLink.startsWith('#'), `${c.name} CTA must start with #`);
    }
  });
});

