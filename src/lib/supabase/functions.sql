-- Function to update event analytics incrementally
CREATE OR REPLACE FUNCTION update_event_analytics(
  event_id UUID,
  view_increment INTEGER DEFAULT 0,
  registration_increment INTEGER DEFAULT 0,
  attendee_increment INTEGER DEFAULT 0,
  revenue_increment DECIMAL DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO event_analytics (event_id, views, registrations, attendees, revenue)
  VALUES (event_id, view_increment, registration_increment, attendee_increment, revenue_increment)
  ON CONFLICT (event_id)
  DO UPDATE SET
    views = event_analytics.views + view_increment,
    registrations = event_analytics.registrations + registration_increment,
    attendees = event_analytics.attendees + attendee_increment,
    revenue = event_analytics.revenue + revenue_increment,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get event statistics for a user
CREATE OR REPLACE FUNCTION get_user_event_stats(user_id UUID)
RETURNS TABLE (
  total_events BIGINT,
  published_events BIGINT,
  draft_events BIGINT,
  total_registrations BIGINT,
  total_attendees BIGINT,
  total_revenue DECIMAL,
  this_month_events BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE status = 'published') as published_events,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_events,
    COALESCE(SUM(ea.registrations), 0) as total_registrations,
    COALESCE(SUM(ea.attendees), 0) as total_attendees,
    COALESCE(SUM(ea.revenue), 0) as total_revenue,
    COUNT(*) FILTER (WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())) as this_month_events
  FROM events e
  LEFT JOIN event_analytics ea ON e.id = ea.event_id
  WHERE e.created_by = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get popular events
CREATE OR REPLACE FUNCTION get_popular_events(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  event_id UUID,
  title VARCHAR,
  category event_category,
  date_time TIMESTAMPTZ,
  location TEXT,
  views INTEGER,
  registrations INTEGER,
  rating DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id as event_id,
    e.title,
    e.category,
    e.date_time,
    e.location,
    ea.views,
    ea.registrations,
    ea.rating
  FROM events e
  JOIN event_analytics ea ON e.id = ea.event_id
  WHERE e.status = 'published'
  ORDER BY (ea.views + ea.registrations * 2 + ea.rating * 10) DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get upcoming events for a user
CREATE OR REPLACE FUNCTION get_user_upcoming_events(user_id UUID)
RETURNS TABLE (
  event_id UUID,
  title VARCHAR,
  date_time TIMESTAMPTZ,
  location TEXT,
  is_creator BOOLEAN,
  is_attendee BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    e.id as event_id,
    e.title,
    e.date_time,
    e.location,
    (e.created_by = user_id) as is_creator,
    (ea_user.user_id IS NOT NULL) as is_attendee
  FROM events e
  LEFT JOIN event_attendees ea_user ON e.id = ea_user.event_id AND ea_user.user_id = user_id
  WHERE 
    e.status = 'published' 
    AND e.date_time > NOW()
    AND (e.created_by = user_id OR ea_user.user_id IS NOT NULL)
  ORDER BY e.date_time ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
