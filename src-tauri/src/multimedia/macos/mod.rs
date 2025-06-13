// use cocoa::base::nil;
// use cocoa::foundation::NSString;
// use objc::runtime::{Class, Object};
// use objc::{msg_send, sel, sel_impl};
// use std::ffi::CStr;

// extern "C" fn notification_callback(notification: *mut Object) {
//     unsafe {
//         let user_info: *mut Object = msg_send![notification, userInfo];
//         if !user_info.is_null() {
//             let song: *mut Object =
//                 msg_send![user_info, objectForKey: NSString::alloc(nil).init_str("Name")];
//             let artist: *mut Object =
//                 msg_send![user_info, objectForKey: NSString::alloc(nil).init_str("Artist")];

//             let song_name = if !song.is_null() {
//                 let c_str: *const i8 = msg_send![song, UTF8String];
//                 CStr::from_ptr(c_str).to_string_lossy().into_owned()
//             } else {
//                 "Unknown Song".to_string()
//             };

//             let artist_name = if !artist.is_null() {
//                 let c_str: *const i8 = msg_send![artist, UTF8String];
//                 CStr::from_ptr(c_str).to_string_lossy().into_owned()
//             } else {
//                 "Unknown Artist".to_string()
//             };

//             println!("Now Playing: {} - {}", song_name, artist_name);
//         }
//     }
// }

// fn main() {
//     unsafe {
//         let notification_center: *mut Object = msg_send![
//             Class::get("NSDistributedNotificationCenter").unwrap(),
//             defaultCenter
//         ];

//         let _: () = msg_send![notification_center,
//             addObserver: notification_callback as *const ()
//             selector: sel!(notification_callback:)
//             name: NSString::alloc(nil).init_str("com.apple.iTunes.playerInfo")
//             object: nil];
//     }

//     loop {
//         // Mantén la aplicación viva para recibir notificaciones
//     }
// }
