"use client";
import React, { useEffect, useState } from "react";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null); // For View Modal

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("https://apis.ukaautotrade.co.uk/api/contact");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
  try {
    const res = await fetch(`https://apis.ukaautotrade.co.uk/api/contact/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Delete failed");
    }

    // remove deleted message from UI
    setMessages((prev) => prev.filter((msg) => msg.id !== id));

    // close modal
    setSelectedMessage(null);

  } catch (error) {
    console.error("Delete error:", error.message);
    alert("Failed to delete message");
  }
};

  return (
    <div className="contact-container">
      <style jsx>{`
        .contact-container { padding: 30px; background: #fdfdfd; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .page-header { margin-bottom: 30px; border-left: 4px solid #ff6b00; padding-left: 20px; }
        .page-header h2 { margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 700; }
        .page-header p { margin: 5px 0 0; color: #666; font-size: 14px; }
        
        .table-card { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid #eee; overflow: hidden; }
        .message-table { width: 100%; border-collapse: collapse; text-align: left; }
        .message-table thead { background: #fff5f0; }
        .message-table th { padding: 16px; font-size: 13px; color: #ff6b00; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .message-table td { padding: 16px; border-bottom: 1px solid #f8f8f8; color: #444; font-size: 14px; vertical-align: middle; }
        .message-table tr:hover { background: #fffcfb; }

        .badge-subject { background: #eee; padding: 4px 10px; border-radius: 20px; font-size: 12px; color: #555; font-weight: 500; }
        .msg-preview { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #888; }
        .btn-view { background: none; border: 1px solid #ff6b00; color: #ff6b00; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s; }
        .btn-view:hover { background: #ff6b00; color: white; }

        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; }
        .modal-content { background: white; width: 100%; max-width: 600px; border-radius: 16px; padding: 30px; position: relative; animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .close-btn { position: absolute; top: 20px; right: 20px; border: none; background: none; font-size: 24px; cursor: pointer; color: #aaa; }
        .modal-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; background: #fafafa; padding: 15px; border-radius: 8px; }
        .meta-item label { display: block; font-size: 11px; text-transform: uppercase; color: #ff6b00; font-weight: 700; margin-bottom: 4px; }
        .meta-item p { margin: 0; font-size: 14px; color: #333; font-weight: 500; }
      `}</style>

      <div className="page-header">
        <h2>Contact Messages</h2>
        <p>Manage and respond to general inquiries from your website.</p>
      </div>

      <div className="table-card">
        {loading ? (
          <div style={{ padding: "50px", textAlign: "center", color: "#ff6b00" }}>
            <strong>Loading your messages...</strong>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ padding: "50px", textAlign: "center", color: "#888" }}>
            No messages found in the database.
          </div>
        ) : (
          <table className="message-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message Snippet</th>
                <th>Date Received</th>
                <th>Actions</th>
                
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#222" }}>{msg.name}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{msg.email}</div>
                  </td>
                  <td><span className="badge-subject">{msg.subject}</span></td>
                  <td><div className="msg-preview">{msg.message}</div></td>
                  <td>{new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>
                    <button className="btn-view" onClick={() => setSelectedMessage(msg)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedMessage(null)}>&times;</button>
            <h3 style={{ marginTop: 0, color: "#ff6b00" }}>Inquiry Details</h3>
            <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "20px 0" }} />
            
            <div className="modal-meta">
              <div className="meta-item">
                <label>Full Name</label>
                <p>{selectedMessage.name}</p>
              </div>
              <div className="meta-item">
                <label>Email Address</label>
                <p>{selectedMessage.email}</p>
              </div>
              <div className="meta-item">
                <label>Phone Number</label>
                <p>{selectedMessage.phone || 'Not provided'}</p>
              </div>
              <div className="meta-item">
                <label>Subject</label>
                <p>{selectedMessage.subject}</p>
              </div>
            </div>

            <label style={{ fontSize: "11px", textTransform: "uppercase", color: "#ff6b00", fontWeight: 700 }}>Message Body</label>
            <div style={{ 
              marginTop: '10px', 
              padding: '20px', 
              background: '#fff5f0', 
              borderRadius: '10px', 
              color: '#444', 
              lineHeight: '1.6',
              fontSize: '15px' 
            }}>
              {selectedMessage.message}
            </div>

            <div style={{ marginTop: "30px", textAlign: "right", background: "#f0f0f0", padding: "15px", borderRadius: "8px" }}>
                <button className="btn-view" onClick={() => handleDelete(selectedMessage.id)}>Delete Message</button>
            </div>
                
            
          
          </div>
        </div>
      )}
    </div>
  );
}