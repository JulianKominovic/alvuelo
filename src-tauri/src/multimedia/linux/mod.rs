use std::sync::Arc;

use super::{MultimediaMetadataStruct, MultimediaStruct, MultimediaTrait};
use mpris::{self, FindingError, Player};

// Create a struct
fn get_active_player() -> Result<Player, FindingError> {
    mpris::PlayerFinder::new()
        .expect("Could not connect to D-Bus")
        .find_active()
}
impl MultimediaTrait for MultimediaStruct {
    fn new() -> Self {
        Self {
            on_multimedia_change: Arc::new(Box::new(|| {})),
            callback: None,
        }
    }
    fn on_multimedia_change(&self, callback: Box<dyn Fn() + Send + Sync + 'static>) {
        tauri::async_runtime::spawn(async move {
            let player = get_active_player();
            loop {
                if player.is_ok() {
                    callback();
                }
                std::thread::sleep(std::time::Duration::from_millis(1000));
            }
        });
    }
    fn is_playing(&self) -> bool {
        match get_active_player() {
            Ok(player) => match player.get_playback_status() {
                Ok(status) => {
                    println!("Status: {:?}", status);
                    status == mpris::PlaybackStatus::Playing
                }
                Err(_) => false,
            },
            Err(_) => false,
        }
    }
    fn play(&self) {
        match get_active_player() {
            Ok(player) => match player.play() {
                Ok(_) => {}
                Err(_) => {}
            },
            Err(_) => {}
        }
    }

    fn pause(&self) {
        match get_active_player() {
            Ok(player) => match player.pause() {
                Ok(_) => {}
                Err(_) => {}
            },
            Err(_) => {}
        }
    }

    fn stop(&self) {
        match get_active_player() {
            Ok(player) => match player.stop() {
                Ok(_) => {}
                Err(_) => {}
            },
            Err(_) => {}
        }
    }

    fn seek(&self, position: f64) {
        match get_active_player() {
            Ok(player) => match player.seek(position as i64) {
                Ok(_) => {}
                Err(_) => {}
            },
            Err(_) => {}
        }
    }

    fn set_volume(&self, volume: f64) {
        match get_active_player() {
            Ok(player) => match player.set_volume(volume) {
                Ok(_) => {}
                Err(_) => {}
            },
            Err(_) => {}
        }
    }

    fn get_volume(&self) -> f64 {
        match get_active_player() {
            Ok(player) => player.get_volume().unwrap_or(0.0),
            Err(_) => 0.0,
        }
    }

    fn set_mute(&self, _mute: bool) {
        // Not supported by mpris
    }

    fn get_mute(&self) -> bool {
        false // Not supported by mpris
    }

    fn set_rate(&self, _rate: f64) {
        // Not supported by mpris
    }

    fn get_rate(&self) -> f64 {
        1.0 // Not supported by mpris
    }

    fn set_position(&self, position: f64) {
        // TODO
    }

    fn get_position(&self) -> f64 {
        match get_active_player() {
            Ok(player) => player.get_position().unwrap_or_default().as_secs_f64(),
            Err(_) => 0.0,
        }
    }

    fn get_metadata(&self) -> MultimediaMetadataStruct {
        match get_active_player() {
            Ok(player) => match player.get_metadata() {
                Ok(metadata) => {
                    let title = metadata.title().unwrap_or("");
                    let artist = metadata.artists().unwrap_or(Vec::new());
                    let album = metadata.album_name().unwrap_or("");
                    let duration = metadata.length().unwrap_or_default();
                    let art_url = metadata.art_url().unwrap_or("");

                    MultimediaMetadataStruct {
                        title: title.to_string(),
                        artists: artist.iter().map(|s| s.to_string()).collect(),
                        album: album.to_string(),
                        year: 0,
                        genre: "".to_string(),
                        duration: duration.as_secs_f64(),
                        cover_url: art_url.to_string(),
                    }
                }
                Err(_) => MultimediaMetadataStruct {
                    title: "".to_string(),
                    artists: Vec::new(),
                    album: "".to_string(),
                    year: 0,
                    genre: "".to_string(),
                    duration: 0.0,
                    cover_url: "".to_string(),
                },
            },
            Err(_) => MultimediaMetadataStruct {
                title: "".to_string(),
                artists: Vec::new(),
                album: "".to_string(),
                year: 0,
                genre: "".to_string(),
                duration: 0.0,
                cover_url: "".to_string(),
            },
        }
    }
}
